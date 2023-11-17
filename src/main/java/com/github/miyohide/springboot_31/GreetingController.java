package com.github.miyohide.springboot_31;

import jakarta.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController {
  private final HttpSession httpSession;
  private final RedisTemplate<String, String> redisTemplate;
  private static final Logger logger = LoggerFactory.getLogger(GreetingController.class);

  public GreetingController(HttpSession httpSession, RedisTemplate<String, String> redisTemplate) {
    this.httpSession = httpSession;
    this.redisTemplate = redisTemplate;
  }

  @GetMapping("/")
  public Greeting greeting(@RequestParam(value = "name", defaultValue = "World") String name) {
    logger.info("HTTP Session id = [" + httpSession.getId() + "]");
    if (httpSession.isNew()) {
      httpSession.setAttribute("name", name);
    }
    return new Greeting(
        httpSession.getId(),
        (String) httpSession.getAttribute("name"),
        httpSession.getCreationTime());
  }

  /**
   * viewSession はRedisに格納された全てのspring sessionのkeyを取り出し、 それぞれの値を表示する
   *
   * @return Redisに格納された全てのspring sessionのKeyの文字列表現
   */
  @GetMapping("/view")
  public String viewSession() {
    Set<String> redisKeys = redisTemplate.keys("spring:session:sessions:*");
    List<String> keysList = new ArrayList<>();
    for (String redisKey : redisKeys) {
      keysList.add(redisKey);
    }
    return keysList.toString();
  }

  @GetMapping("/goodbye")
  public String goodbye() {
    String httpSessionId = httpSession.getId();
    String name = httpSession.getAttribute("name").toString();
    httpSession.invalidate();
    return "bye. HTTP Session id = [" + httpSessionId + "], name = [" + name + "]";
  }
}
